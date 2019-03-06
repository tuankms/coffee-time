import usersService from '@/services/UserService';

describe('UsersService.spec', () => {
  it('Invokes getAllUserIds() successfully - Return a list of Ids', () => {
    const users = {
      'user-001': {
        id: 'user-001',
        fullName: 'User 001',
        relationship: []
      },
      'user-002': {
        id: 'user-002',
        fullName: 'User 002',
        relationship: []
      }
    };
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

  it('Invokes findPartner() with all valid parameters - Return a random partner id', () => {
    const allUsers = {
      'user-001': {
        id: 'user-001',
        fullName: 'User 001',
        relationship: []
      },
      'user-002': {
        id: 'user-002',
        fullName: 'User 002',
        relationship: []
      }
    };

    const currentUser = {
      id: 'user-001',
      fullName: 'User 001',
      relationship: []
    };

    const actualPartnerId = usersService.findPartner(currentUser, allUsers);

    expect(actualPartnerId).toEqual('user-002');
  });

  it('Invokes findPartner() with invalid currentUser parameter - Return null', () => {
    const allUsers = {
      'user-001': {
        id: 'user-001',
        fullName: 'User 001',
        relationship: []
      },
      'user-002': {
        id: 'user-002',
        fullName: 'User 002',
        relationship: []
      }
    };

    const currentUser = null;

    const actualPartnerId = usersService.findPartner(currentUser, allUsers);

    expect(actualPartnerId).toBe(null);
  });

  it('Invokes findPartner() with invalid allUsers parameter - Return null', () => {
    const allUsers = {};

    const currentUser = {
      id: 'user-001',
      fullName: 'User 001',
      relationship: []
    };

    const actualPartnerId = usersService.findPartner(currentUser, allUsers);

    expect(actualPartnerId).toBe(null);
  });

  it('Invokes updateRelations() with valid parameters - Current User and Partner relationship will be updated correctly', () => {
    const currentUser = {
      id: 'user-001',
      fullName: 'User 001',
      relationship: []
    };

    const partner = {
      id: 'user-002',
      fullName: 'User 002',
      relationship: []
    };

    usersService.updateRelations(currentUser, partner);

    expect(currentUser.relationship.includes('user-002')).toBeTruthy();
    expect(partner.relationship.includes('user-001')).toBeTruthy();
  });

  it('Invokes updateRelations() with invalid currentUser parameter - Nothing updates', () => {
    const currentUser = null;

    const partner = {
      id: 'user-002',
      fullName: 'User 002',
      relationship: []
    };

    usersService.updateRelations(currentUser, partner);

    expect(currentUser).toBe(null);
    expect(partner.relationship.length).toEqual(0);
  });

  it('Invokes updateRelations() with invalid partner parameter - Nothing updates', () => {
    const currentUser = {
      id: 'user-001',
      fullName: 'User 001',
      relationship: []
    };

    const partner = null;

    usersService.updateRelations(currentUser, partner);

    expect(partner).toBe(null);
    expect(currentUser.relationship.length).toEqual(0);
  });
});
