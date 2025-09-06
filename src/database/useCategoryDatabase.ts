import { useSQLiteContext } from "expo-sqlite";
import { Category } from "src/types/Category";

export function useCategoryDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<Category, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO categories (name, description) VALUES ($name, $description)"
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
            const query = "SELECT * FROM categories WHERE name LIKE ? ORDER BY name ASC";
                    
            const response = await database.getAllAsync<Category>(
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
            const query = "SELECT * FROM categories WHERE id = ?";
    
            const response = await database.getFirstAsync<Category>(
                query,
                id
            );
    
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: Category) {
        const statement = await database.prepareAsync(
            "UPDATE categories SET name = $name, description = $description WHERE id = $id"
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
            await database.execAsync("DELETE FROM categories WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    async function hasSteps(categoryId: number) {
        try {
            const query = "SELECT COUNT(*) AS count FROM steps WHERE category_id = ?";

            const response = await database.getFirstAsync<{ count: number }>(
                query,
                categoryId
            );

            return (response?.count ?? 0) > 0;
        } catch (error) {
            throw error;
        }
    }

    return { create, searchByName, searchById, update, remove, hasSteps };
}