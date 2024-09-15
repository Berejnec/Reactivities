import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { toast } from "react-toastify";
import { store } from "../stores/store";
import { Photo, Profile, UserActivity } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep(1000);
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));

      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    const navigate = store.userStore.navigate;
    switch (status) {
      case 400:
        if (typeof data === "string") {
          toast.error(data);
        }
        if (config.method === "get" && (data as any).errors.hasOwnProperty("id")) {
          if (navigate) navigate("/not-found");
        }
        if ((data as any).errors) {
          const modalStateErrors = [];
          for (const key in (data as any).errors) {
            if ((data as any).errors[key]) {
              modalStateErrors.push((data as any).errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error("Unauthorized");
        break;
      case 404:
        if (navigate) navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data as any);
        if (navigate) navigate("/server-error");
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<Activity[]>>("/activities", { params: params }).then(responseBody),
  details: (id: string) => requests.get<Activity | undefined>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("account/login", user),
  register: (user: UserFormValues) => requests.post<User>("account/register", user),
};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo>("photos", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  },
  setMainPhoto: (photoId: string) => requests.post(`/photos/${photoId}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  getActivities: (username: string, predicate: string) =>
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
