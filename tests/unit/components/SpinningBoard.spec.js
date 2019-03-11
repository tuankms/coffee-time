import { shallowMount } from '@vue/test-utils';
import SpinningBoard from '@/components/SpinningBoard.vue';

const userServiceMock = jest.mock('@/services/UserService', () => {
  return {
    randomUser: (users) => {
      if (!users) {
        return null;
      }
      return users[Math.floor(Math.random() * users.length)];
    },
    getCollection: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    getAllUserIds: jest.fn()
  };
});

describe('SpinningBoard.vue', () => {
  it('[UI] Renders SpinningBoard with default view', () => {
    const wrapper = shallowMount(SpinningBoard);
    const htmlContent = wrapper.html();
    // contain a form and user input, submit button
    expect(htmlContent).toContain('<form>');
    expect(htmlContent).toContain('<input placeholder="Your name" class="input">');
    expect(htmlContent).toContain('<button type="submit">');

    // contain a signup link
    expect(htmlContent).toContain('<a href="#">Sign up</a>');

    // don't contain Coffee time panel
    expect(htmlContent).not.toContain('</coffeetimepanel-stub>');
  });

  it('[UI] Renders CoffeeTimePanel component when found a partner to coffee', () => {
    const wrapper = shallowMount(SpinningBoard);

    wrapper.setData({
      hasShowResult: true,
      currentUser: {
        id: 'user-001',
        fullName: 'User 001',
        relationship: ['user-002']
      },
      suggestedPartner: {
        id: 'user-002',
        fullName: 'User 002',
        relationship: ['user-001']
      }
    });

    const htmlContent = wrapper.html();

    expect(htmlContent).toContain('</coffeetimepanel-stub>');
    expect(htmlContent).toContain('Get coffee with: User 002, here’s how many times you’ve had coffee with them: 1');
  });

  it('[UI] Renders CoffeeTimePanel component when user already caffeinated with everyone', () => {
    const wrapper = shallowMount(SpinningBoard);

    wrapper.setData({
      hasShowResult: true,
      currentUser: {
        id: 'user-001',
        fullName: 'User 001',
        relationship: ['user-002']
      },
      suggestedPartner: null
    });

    const htmlContent = wrapper.html();

    expect(htmlContent).toContain('</coffeetimepanel-stub>');
    expect(htmlContent).toContain("You've already caffeinated with everyone!");
  });

  it('[Behaviour] Invokes spin() with user not found', () => {
    const wrapper = shallowMount(SpinningBoard);

    wrapper.setData({
      users: {
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
      }
    });

    const vm = wrapper.vm;

    // Enter unexited user
    vm.spin('user-test-001');

    expect(vm.currentUser).toBe(null);
    expect(vm.suggestedPartner).toBe(null);
  });

  it('[Behaviour] Invokes spin() with a user already exited - Found a partner to coffee with', () => {
    const wrapper = shallowMount(SpinningBoard);

    const enteredUser = {
      id: 'user-001',
      fullName: 'User 001',
      relationship: []
    };

    wrapper.setData({
      currentUserId: enteredUser['.key'],
      users: {
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
      }
    });

    // Mock userService.getAllUserIds
    const getAllUserIdsMock = jest.fn();
    getAllUserIdsMock.mockReturnValue(['user-001', 'user-002']);

    const vm = wrapper.vm;

    userServiceMock.getAllUserIds = getAllUserIdsMock;

    vm.spin(enteredUser.id);

    expect(vm.currentUser).not.toBe(null);
    expect(vm.currentUser.fullName).toBe('User 001');

    // Expect User 001 will coffee with User 002
    expect(vm.suggestedPartner.fullName).toBe('User 002');
  });

  it('[Behaviour] Invokes spin() with a user already exited - NOT found a partner to coffee with', () => {
    const wrapper = shallowMount(SpinningBoard);

    // User 001 already caffeinated with everyone
    const enteredUser = {
      id: 'user-001',
      fullName: 'User 001',
      relationship: []
    };

    wrapper.setData({
      currentUserId: enteredUser.id,
      users: {
        'user-001': {
          id: 'user-001',
          fullName: 'User 001',
          relationship: [
            'user-002'
          ]
        },
        'user-002': {
          id: 'user-002',
          fullName: 'User 002',
          relationship: [
            'user-001'
          ]
        }
      }
    });

    const vm = wrapper.vm;

    vm.spin(enteredUser.id);

    expect(wrapper.vm.currentUser).not.toBe(null);
    expect(wrapper.vm.currentUser.fullName).toBe('User 001');

    expect(wrapper.vm.suggestedPartner).toBe(null);
  });
});
