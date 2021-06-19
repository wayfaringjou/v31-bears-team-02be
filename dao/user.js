import bcrypt from 'bcryptjs';
import knex from 'knex';
import xss from 'xss';

// User data access object (used to abstract interface w/ db)
class UserDAO {
	usersTable = 'users';
	/**
	 * Create new user in DB with given username and password strings
	 * @param {knex} db - knex db connection object
	 * @param {string} username - Username string
	 * @param {string} password - Password string
	 * @returns {Promise<{
	 * user_id: number, username: string, password: string, date_created: string,
	 * }>} Promise that resolves to the created user data form db
	 */
	async createUser(db, username, password) {
		// destructure user after creating new user
		const [user] = await db('user')
			.insert({ // knex syntax:
				username,
				password
			})
			.into(this.usersTable)
			.returning('*');

		return user;
	}
	/**
	 * Check if given string is already used for username in users table
	 * @param {knex} db - knex db connection object
	 * @param {string} username - Username string to check against db data
	 * @returns {Promise<boolean>} Promise resolves to true if given string is taken
	 */
	async usernameTaken(db, username) {
		const nameInDB = await db(this.usersTable)
			.where({ username })
			.first()
		return Boolean(nameInDB);
	}
	/**
	 * Use bcrypt.hash to generate hash from given password string
	 * @param {string} password password string provided by user
	 * @return {Promise<string>} salt and hash string generated by bcrypt
	 */
	async hashPassword(password) {
		const hash = await bcrypt.hash(password, 12);
		return hash;
	}
	/**
	 * Sanitize and parse database values before sending them to client
	 * @param {{user_id: number, username: string, date_created: string}} user - User object from database 
	 * @returns {{user_id: number, username: string, date_created: string}} User object formatted for transfer
	 */
	serializeUser = (user) => ({
		user_id: user.user_id,
		username: xss(user.username),
		date_created: user.date_created,
	})
}

export default new UserDAO();