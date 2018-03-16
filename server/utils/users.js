class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {
      id,
      name,
      room
    };

    this.users.push(user);

    return user;
  }

  removeUser(id) {
    // return user was removed
    var user = this.getUser(id);

    if (user) {
      var idx = this.users.indexOf(user);
      this.users.splice(idx, 1);
      // this.users =  this.users.filter((user)=> user.id !== id)
    }

    return user;
  }

  getUser(id) {
    var user = this.users.filter(user => user.id === id)[0];

    return user;
  }

  getUserByName(name) {
    return this.users.filter(
      user => user.name.toUpperCase() === name.toUpperCase()
    )[0];
  }

  getUserList(room) {
    var users = this.users.filter(user => user.room === room);
    var namesArray = users.map(user => user.name);

    return namesArray;
  }

  getRooms() {
    var rooms = this.users.map(user => user.room);

    return rooms.filter((v, i) => rooms.indexOf(v) == i);
  }
}

module.exports = { Users };
