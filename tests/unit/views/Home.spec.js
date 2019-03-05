import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('Home.vue', () => {
  it('[UI] Renders Home Component with a logo', () => {
    const wrapper = shallowMount(Home);
    const htmlContent = wrapper.html();

    const expectedRender = '<img alt=';
    expect(htmlContent).toContain(expectedRender);
  });

  it('[UI] Renders Home Component with SpingningBoard Component', () => {
    const wrapper = shallowMount(Home);
    const htmlContent = wrapper.html();

    const expectedRender = '<spingningboard-stub></spingningboard-stub>';
    expect(htmlContent).toContain(expectedRender);
  });
});
