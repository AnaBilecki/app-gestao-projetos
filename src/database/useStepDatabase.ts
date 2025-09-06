import { useSQLiteContext } from "expo-sqlite";
import { Step } from "src/types/Step";

export function useStepDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<Step, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO steps (name, description, category_id) VALUES ($name, $description, $categoryId)"
        );

        try {
            await statement.executeAsync({
                $name: data.name,
                $description: data.description,
                $categoryId: data.categoryId
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function searchByName(name: string) {
        try {
            const query = `
                SELECT
                    s.id AS stepId,
                    s.category_id AS categoryId,
                    s.name AS stepName,
                    s.description AS description,
                    c.name AS categoryName
                FROM steps s
                LEFT JOIN categories c ON c.id = s.category_id
                WHERE s.name LIKE ? ORDER BY s.name ASC
            `;
            
            const response = await database.getAllAsync<any>(
                query,
                `%${name}%`
            );
            
            const steps: Step[] = response.map((row: any) => ({
                id: row.stepId,
                name: row.stepName,
                description: row.description,
                categoryId: row.categoryId,
                categoryName: row.categoryName
            }));

            return steps;
        } catch (error) {
            throw error;
        }
    }

    async function searchById(id: number) {
        try {
            const query = `
                SELECT
                    s.id AS stepId,
                    s.category_id AS categoryId,
                    s.name AS stepName,
                    s.description AS description,
                    c.name AS categoryName
                FROM steps s
                LEFT JOIN categories c ON c.id = s.category_id
                WHERE s.id = ?
            `;
    
            const response = await database.getAllAsync<any>(
                query,
                id
            );

            const step: Step = {
                id: response[0].stepId,
                name: response[0].stepName,
                description: response[0].description,
                categoryId: response[0].categoryId,
                categoryName: response[0].categoryName
            };
    
            return step;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: Step) {
        const statement = await database.prepareAsync(
            "UPDATE steps SET name = $name, description = $description, category_id = $categoryId WHERE id = $id"
        );
    
        try {
            await statement.executeAsync({
                $id: data.id,
                $name: data.name,
                $description: data.description,
                $categoryId: data.categoryId
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        } 
    }

    async function remove(id: number) {
        try {
            await database.execAsync("DELETE FROM steps WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    async function hasProjects(stepId: number) {
        try {
            const query = "SELECT COUNT(*) AS count FROM project_steps WHERE step_id = ?";

            const response = await database.getFirstAsync<{ count: number }>(
                query,
                stepId
            );

            return (response?.count ?? 0) > 0;
        } catch (error) {
            throw error;
        }
    }

    return { create, searchByName, searchById, update, remove, hasProjects };
}