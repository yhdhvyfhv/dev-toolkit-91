// TypeScript services module

// UserService interface defines the structure of user data
interface UserService {
    getUser(id: number): Promise<User | null>;
    createUser(user: User): Promise<User>;
}

// User interface representing a user object
interface User {
    id: number;
    name: string;
    email: string;
}

// Sample in-memory user database
const usersDB: User[] = [];

// Implementation of UserService
class UserServiceImpl implements UserService {
    // Fetch a user by ID
    async getUser(id: number): Promise<User | null> {
        return usersDB.find(user => user.id === id) || null;
    }

    // Create a new user
    async createUser(user: User): Promise<User> {
        usersDB.push(user);
        return user;
    }
}

// Example usage of UserService
const userService: UserService = new UserServiceImpl();

// Creating a user and fetching it back
async function exampleUsage() {
    const newUser: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
    await userService.createUser(newUser);
    const fetchedUser = await userService.getUser(1);
    console.log(fetchedUser);
}

exampleUsage();