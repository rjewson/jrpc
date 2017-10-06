export default (target) =>
  new Proxy(target, {
    get: function(target, name, receiver) {
      const targetProp = target[name];
      // debugger;
      if (targetProp) {
        return targetProp.bind(target);
      } else {
        return (...args) => {
          return new Promise(resolve => {
            resolve("ok");
          });
        };
      }
    }
  });
