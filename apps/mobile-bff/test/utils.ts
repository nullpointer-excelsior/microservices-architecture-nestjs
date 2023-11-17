import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import axios, { AxiosResponse, AxiosError } from 'axios';


export function graphqlRequest(app: INestApplication) {
    return function (query: string) {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(HttpStatus.OK)
    }
}


export async function createResource<T = any>(endpoint: string, data: T): Promise<AxiosResponse<T>> {
  try {
    const response = await axios.post(`http://localhost:3011/${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Server responded with a non-2xx status code
        console.error('Request failed with status code:', axiosError.response.status, axiosError.response.data);
      } else if (axiosError.request) {
        // No response received
        console.error('Request made but no response received:', axiosError.request);
      } else {
        // Something went wrong while setting up the request
        console.error('Error setting up the request:', axiosError.message);
      }
    } else {
      // Handle other types of errors
      console.error('Unexpected error occurred:', error);
    }
    // Re-throw the error to let the caller handle it
    throw error;
  }
}