import axios from "axios";
import { setCookie } from "cookies-next";

const URL = process.env.NEXT_PUBLIC_URL_API;

export const clientSignIn = async (data: any) => {

  return axios.post(`${URL}/api/login`, data, {
    headers: {
        'Content-Type': 'application/json',
    },
  }).then((response) => {
        if (response.data.statusCode === 200) {
        const user = response.data.user;
        return Promise.all([
            setCookie('user', user, { maxAge: 30 * 24 * 60 * 60 }),
        ]);
    }
    })
    .catch((error: any) => {
      return error;
    });
}
