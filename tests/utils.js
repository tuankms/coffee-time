import Vue from 'vue';

function mountComponentWithProps(Component, propsData) {
  const Constructor = Vue.extend(Component);
  const vm = new Constructor({
    propsData
  }).$mount();

  return vm;
}

export {
  mountComponentWithProps
};
