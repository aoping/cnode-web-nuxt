import axios from '@/plugins/axios';
import config from '@/config'
import qs from 'qs'

export function getTopics(
  page = 1,
  tab = 'all'
) {
  return axios.get(`/topics?limit=${config.PAGENUM}&mdrender=true&page=${page}&tab=${tab}`)
}

export function signup(ruleForm) {
  const {
    loginname,
    pass,
    re_pass,
    email
  } = ruleForm
  return axios.post(`/signup`, {
    loginname,
    pass,
    re_pass,
    email
  })
}

export function login(ruleForm) {
  const {
    loginname,
    pass,
  } = ruleForm
  return axios.post(`/login`, {
    loginname,
    pass,
  })
}

export function getTopicDetail(id) {
  return axios.get(`/topic/${id}`)
}


export function getUser(id) {
  return axios.get(`/user/${id}`)
}

export function accesstoken(accesstoken) {
  return axios.post('/accesstoken', {
    accesstoken
  })
}

export function ups(accesstoken, topicid) {
  return axios.post(`/reply/${topicid}/ups`, {
    accesstoken
  })
}

export function replies(accesstoken, topicid, content) {
  return axios.post(`/topic/${topicid}/replies`, {
    accesstoken,
    content,
  })
}
