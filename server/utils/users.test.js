const expect = require("expect");
const { Users } = require("./users");

var users;

beforeEach(() => {
  users = new Users();
  users.users = [
    {
      id: "1",
      name: "mike",
      room: "Node Course"
    },
    {
      id: "2",
      name: "jen",
      room: "React Course"
    },
    {
      id: "3",
      name: "julie",
      room: "Node Course"
    }
  ];
});

describe("Users", () => {
  it("should add new user", () => {
    var users = new Users();
    var user = {
      id: "123",
      name: "indra",
      room: "camp10"
    };

    var res = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it("should return names for node course", () => {
    var userList = users.getUserList("Node Course");
    expect(userList).toEqual(["mike", "julie"]);
  });

  it("should return names for react course", () => {
    var userList = users.getUserList("React Course");
    expect(userList).toEqual(["jen"]);
  });

  it("should remove a user", () => {
    var user = users.removeUser("2");
    expect(user.id).toBe("2");
    expect(users.users).not.toMatchObject(user);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", () => {
    var user = users.removeUser("4");
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it("should find user", () => {
    var user = users.getUser("1");

    expect(user.name).toBe("mike");
  });

  it("should not find user", () => {
    var user = users.getUser("5");

    expect(user).toBeFalsy;
  });


  it("should find user by name", () => {
    var user = users.getUserByName("mike");

    expect(user.name.toUpperCase()).toBe("mike".toUpperCase());
  });

  it("should not find user name", () => {
    var user = users.getUserByName("joko");

    expect(user).toBeFalsy;
  });
});
