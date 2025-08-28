import { useSQLiteContext } from "expo-sqlite";
import { Customer } from "src/types/Customer";

export function useCustomerDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<Customer, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO customers (name, email, phone, city, state) VALUES ($name, $email, $phone, $city, $state)"
        );

        try {
            await statement.executeAsync({
                $name: data.name,
                $email: data.email,
                $phone: data.phone,
                $city: data.city,
                $state: data.state
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function searchByName(name: string) {
        try {
            const query = "SELECT * FROM customers WHERE name LIKE ? ORDER BY name ASC";

            const response = await database.getAllAsync<Customer>(
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
            const query = "SELECT * FROM customers WHERE id = ?";

            const response = await database.getFirstAsync<Customer>(
                query,
                id
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: Customer) {
        const statement = await database.prepareAsync(
            "UPDATE customers SET name = $name, email = $email, phone = $phone, city = $city, state = $state WHERE id = $id"
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $name: data.name,
                $email: data.email,
                $phone: data.phone,
                $city: data.city,
                $state: data.state
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        } 
    }

    async function remove(id: number) {
        try {
            await database.execAsync("DELETE FROM customers WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    async function hasProjects(customerId: number) {
        try {
            const query = "SELECT COUNT(*) AS count FROM projects WHERE customer_id = ?";

            const response = await database.getFirstAsync<{ count: number }>(
                query,
                customerId
            );

            return (response?.count ?? 0) > 0;
        } catch (error) {
            throw error;
        }
    }

    return { create, searchByName, searchById, update, remove, hasProjects };
}