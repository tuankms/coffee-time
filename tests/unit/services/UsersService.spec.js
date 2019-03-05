import usersService from '@/services/UsersService';

describe('UsersService.spec', () => {
  it('Invokes getAllUserIds() successfully - Return a list of Ids', () => {
    const users = [
      { '.key': 'user-001', fullName: 'User 001', relationship: [] },
      { '.key': 'user-002', fullName: 'User 002', relationship: [] }
    ];
    const actualUserIds = usersService.getAllUserIds(users);

    const expectedUserIds = [
      'user-001',
      'user-002'
    ];

    expect(actualUserIds.length).toEqual(expectedUserIds.length);
    expect(actualUserIds).toEqual(expect.arrayContaining(expectedUserIds));
  });

  it('Invokes getAllUserIds() with empty input - Return an empty array', () => {
    const users = [];
    const actualUserIds = usersService.getAllUserIds(users);

    const expectedUserIds = [];

    expect(actualUserIds.length).toEqual(expectedUserIds.length);
    expect(actualUserIds).toEqual(expect.arrayContaining(expectedUserIds));
  });

  it('Invokes randomUser() with an empty array as a input - Return a null', () => {
    const users = [];
    const actualUser = usersService.randomUser(users);

    expect(actualUser).toEqual(null);
  });

  it('Invokes randomUser() with an array as a input - Return a random item of a input array', () => {
    const users = [
      'user-001',
      'user-002'
    ];
    const actualUser = usersService.randomUser(users);

    expect(users.includes(actualUser)).toBeTruthy();
  });
});
