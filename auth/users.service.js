import bcrypt from 'bcryptjs';
import knex from 'knex';
import xss from 'xss';

const UsersService = {
  usersTable: 'users',
  async usernameTaken(db, username) {
    return Boolean(
      await db(this.usersTable)
      .where({username})
      .first(),
    );
  },
  /**
   *  Given a db connection and a new user object, add it to the table 'users'
   * @param {knex} db - knex db connection object
   * @param {{
   * user_id: number,
   * username: string,
   * password: string,
   * date_created: string, 
   * }} newUser - User object with keys correspoding with columns in 'users' table
   * @return {{
   * user_id: number, 
   * username: string,
   * password: string,
   * date_created: string,
   * }}  The inserted user object
   */
  async insertUser(db, newUser) {
    const user = await db
    .insert(newUser)
    .into(this.usersTable)
    .returning('*')

    return user;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser: (user) => ({
    user_id: user.user_id,
    user_name: xss(user.username),
    date_created: user.date_created,
  })
}

export default UsersService;