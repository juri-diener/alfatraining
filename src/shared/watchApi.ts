import axios, { AxiosResponse, Method } from 'axios';
import { Dispatch, SetStateAction } from 'react';

// callback: (data: T) => void | Dispatch<SetStateAction<T | undefined>>
// kann auch so als argument gelifert werden um die möglichkeit dann im 
// callback Zeile 13: mit einer Funktion aufzurufen.


export const watchApi = <T>(method: Method, path: string, callback: (data: T) => void, data = {}): void => {
  const baseUrl = 'http://localhost:3001';
  axios({
    method,
    url: `${baseUrl}${path}`,
    data
  }).then((response: AxiosResponse<T>) => callback(response.data)).catch(console.log);
}