import { useSQLiteContext } from "expo-sqlite";
import { Step } from "src/types/Step";

export function useStepDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<Step, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO steps (name, description) VALUES ($name, $description)"
        );

        try {
            await statement.executeAsync({
                $name: data.name,
                $description: data.description
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function searchByName(name: string) {
        try {
            const query = "SELECT * FROM steps WHERE name LIKE ? ORDER BY name ASC";
            
            const response = await database.getAllAsync<Step>(
                query,
                `%${name}%`
            );
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function searchById(id: number) {
        try {
            const query = "SELECT * FROM steps WHERE id = ?";
    
            const response = await database.getFirstAsync<Step>(
                query,
                id
            );
    
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: Step) {
        const statement = await database.prepareAsync(
            "UPDATE steps SET name = $name, description = $description WHERE id = $id"
        );
    
        try {
            await statement.executeAsync({
                $id: data.id,
                $name: data.name,
                $description: data.description
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