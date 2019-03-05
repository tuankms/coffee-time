import { shallowMount } from '@vue/test-utils';
import CoffeeTimePanel from '@/components/CoffeeTimePanel.vue';

const appTitle = 'Coffee Time';

describe('CoffeeTimePanel.vue', () => {
  it('renders component with correct message and style', () => {
    const message = 'Coffee Time Panel';
    const wrapper = shallowMount(CoffeeTimePanel, {
      propsData: {
        message
      }
    });
    expect(wrapper.text()).toContain(appTitle);
    expect(wrapper.text()).toContain('Coffee Time Panel');
    expect(wrapper.html()).toContain('class="coffeeTimePanel"');
    expect(wrapper.html()).toContain('class="header"');
    expect(wrapper.html()).toContain('class="body"');
  });

  it('renders props.message when passed to CoffeeTimePanel Component ', () => {
    const message = 'Coffee Time Panel';
    const wrapper = shallowMount(CoffeeTimePanel, {
      propsData: {
        message
      }
    });
    expect(wrapper.text()).toContain(appTitle);
    expect(wrapper.text()).toContain(message);
  });

  it('renders props.message is empty', () => {
    const wrapper = shallowMount(CoffeeTimePanel);
    expect(wrapper.text()).toBe(appTitle);
  });
});
