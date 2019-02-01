import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      userInfo: {}
    },
    getters: {
      getUserInfo(state) {
        return state.userInfo;
      }
    },
    mutations: {
      setUserInfo(state, userInfo) {
        state.userInfo = userInfo;
      }
    },
    actions: {
      setUserInfo({
        commit
      }, user) {
        console.log(user)
        commit('setUserInfo', user);
      }
    }
  })
}

export default createStore
