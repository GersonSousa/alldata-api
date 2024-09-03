const database = require('../database/prisma');

class UserRepository {
  async create(data) {
    return await database.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });
  }

  async findByEmail(email) {
    return await database.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        password: true,
      },
    });
  }

  async findAll() {
    return await database.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });
  }

  async updatePassword(id, newPassword) {
    return await database.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }
}

module.exports = new UserRepository();
