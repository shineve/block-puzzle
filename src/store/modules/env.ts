const state = () => {
  boardSize: 0;
};

const getters = {
  boardSize(state) {
    return state.boardSize;
  },
};

const actions = {
  getBoardSize({ commit }) {
    const rem: number = parseInt(window.getComputedStyle(document.documentElement)['font-size']);
    // const boardWidth = document.querySelector('#board')?.getClientRects()[0].width;
    const boardWidth = document.getElementById('board')?.offsetWidth;
    const documentWidth = (boardWidth - rem).toFixed(2);
    commit('setBoardSize', documentWidth);
  },
};

const mutations = {
  setBoardSize(state, value) {
    state.boardSize = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
