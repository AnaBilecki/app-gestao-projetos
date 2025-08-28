import { useSQLiteContext } from "expo-sqlite";
import { Project } from "src/types/Project";

export function useProjectDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<Project, "id">) {
        const createProjectStatement = await database.prepareAsync(
            "INSERT INTO projects (name, customer_id, start_date, end_date, deadline) VALUES ($name, $customerId, $startDate, $endDate, $deadline)"
        );

        const createProjectStepStatement = await database.prepareAsync(
            "INSERT INTO project_steps (project_id, step_id) VALUES ($projectId, $stepId)"
        ); 
    
        try {
            const result = await createProjectStatement.executeAsync({
                $name: data.name,
                $customerId: data.customerId,
                $startDate: data.startDate,
                $endDate: data.endDate,
                $deadline: data.deadline
            });

            const projectId = result.lastInsertRowId;

            if (data.steps && data.steps.length > 0) {
                for (const step of data.steps) {
                    await createProjectStepStatement.executeAsync({
                        $projectId: projectId,
                        $stepId: step.stepId
                    });
                }
            }
        } catch (error) {
            throw error;
        } finally {
            await createProjectStatement.finalizeAsync();
            await createProjectStepStatement.finalizeAsync();
        }
    }

    async function searchByName(name: string) {
        try {
            const query = `
                SELECT 
                    p.id AS projectId,
                    p.name AS projectName,
                    p.customer_id AS customerId,
                    c.name AS customerName,
                    p.start_date AS startDate,
                    p.end_date AS endDate,
                    p.deadline AS deadline,

                    ps.id AS projectStepId,
                    ps.step_id AS stepId,
                    ps.completed AS completed,
                    ps.step_order as stepOrder,

                    s.name AS stepName,
                    s.description AS stepDescription
                FROM projects p
                LEFT JOIN customers c ON c.id = p.customer_id
                LEFT JOIN project_steps ps ON ps.project_id = p.id
                LEFT JOIN steps s ON s.id = ps.step_id
                WHERE p.name LIKE ?
                ORDER BY p.name ASC
            `;

            const response = await database.getAllAsync<any>(
                query,
                `%${name}%`
            );

            const projects = new Map<number, Project>();

            for (const row of response) {
                if (!projects.has(row.projectId)) {
                    projects.set(row.projectId, {
                        id: row.projectId,
                        name: row.projectName,
                        customerId: row.customerId,
                        customerName: row.customerName,
                        startDate: row.startDate,
                        endDate: row.endDate,
                        deadline: row.deadline,
                        steps: [],
                    })
                }

                if (row.stepId) {
                    projects.get(row.projectId)!.steps!.push({
                        id: row.projectStepId,
                        stepId: row.stepId,
                        projectId: row.projectId,
                        completed: !!row.completed,
                        name: row.stepName,
                        description: row.stepDescription,
                        stepOrder: row.stepOrder
                    });
                }
            }

            return Array.from(projects.values());
        } catch (error) {
            throw error;
        }
    }

    async function searchById(id: number) {
        try {
            const query = `
                SELECT 
                    p.id AS projectId,
                    p.name AS projectName,
                    p.customer_id AS customerId,
                    c.name AS customerName,
                    p.start_date AS startDate,
                    p.end_date AS endDate,
                    p.deadline AS deadline,

                    ps.id AS projectStepId,
                    ps.step_id AS stepId,
                    ps.completed AS completed,
                    ps.step_order as stepOrder,

                    s.name AS stepName,
                    s.description AS stepDescription
                FROM projects p
                LEFT JOIN customers c ON c.id = p.customer_id
                LEFT JOIN project_steps ps ON ps.project_id = p.id
                LEFT JOIN steps s ON s.id = ps.step_id
                WHERE p.id = ?
                ORDER BY ps.step_order ASC
            `;

            const response = await database.getAllAsync<any>(
                query,
                id
            );

            const project: Project = {
                id: response[0].projectId,
                name: response[0].projectName,
                customerId: response[0].customerId,
                customerName: response[0].customerName,
                startDate: response[0].startDate,
                endDate: response[0].endDate,
                deadline: response[0].deadline,
                steps: [],
            };

            for (const row of response) {
                if (row.stepId) {
                    project.steps!.push({
                        id: row.projectStepId,
                        stepId: row.stepId,
                        projectId: row.projectId,
                        completed: !!row.completed,
                        name: row.stepName,
                        description: row.stepDescription,
                        stepOrder: row.stepOrder
                    });
                }
            }

            return project;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: Project) {
        const updateProjectStatement = await database.prepareAsync(
            "UPDATE projects SET name = $name, customer_id = $customerId, deadline = $deadline, start_date = $startDate, end_date = $endDate WHERE id = $id"
        );

        const deleteProjectStepsStatement = await database.prepareAsync(
            "DELETE FROM project_steps WHERE project_id = $projectId"
        );

        const createProjectStepStatement = await database.prepareAsync(
            "INSERT INTO project_steps (project_id, step_id, completed, step_order) VALUES ($projectId, $stepId, $completed, $stepOrder)"
        );

        try {
            await updateProjectStatement.executeAsync({
                $id: data.id,
                $name: data.name,
                $customerId: data.customerId,
                $deadline: data.deadline,
                $startDate: data.startDate,
                $endDate: data.endDate
            });

            await deleteProjectStepsStatement.executeAsync({ $projectId: data.id });

            for (const step of data.steps || []) {
                await createProjectStepStatement.executeAsync({
                    $projectId: data.id,
                    $stepId: step.stepId,
                    $completed: step.completed ? 1 : 0,
                    $order: step.stepOrder ? step.stepOrder : null
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await updateProjectStatement.finalizeAsync();
            await deleteProjectStepsStatement.finalizeAsync();
            await createProjectStepStatement.finalizeAsync();
        } 
    }

    async function remove(id: number) {
        try {
            const query = "SELECT id FROM project_steps WHERE project_id = ?";

            const response = await database.getAllAsync<any>(
                query,
                id
            );

            for (const row of response) {
                await database.execAsync("DELETE FROM project_steps WHERE id = " + row.id);
            }

            await database.execAsync("DELETE FROM projects WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    return { create, searchByName, searchById, update, remove };
}