export const getUserByToken = jest.fn();

const mock = jest.mock("../../../controllers/Users", () => {
  return {
    Users: jest.fn().mockImplementation(() => {
      return {
        getUserByToken
      };
    })
  }
});

export default mock;