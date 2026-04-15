type RequestData =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

import { ErrorHandler } from "./error-handler";

export class Api {
  private readonly sourceUrl: string;
  private readonly url: string;

  constructor(url: string, sourceUrl = "http://localhost:8000") {
    this.sourceUrl = sourceUrl;
    this.url = `${this.sourceUrl}${url}`;
  }

  private async parseResponseBody(response: Response) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  async get() {
    try {
      const response = await fetch(this.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await this.parseResponseBody(response);

      if (!response.ok) {
        throw ErrorHandler.fromResponse(response.status, body);
      }

      return body;
    } catch (error) {
      throw ErrorHandler.fromUnknown(error);
    }
  }

  async post(data: RequestData) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await this.parseResponseBody(response);

      if (!response.ok) {
        throw ErrorHandler.fromResponse(response.status, body);
      }

      return body;
    } catch (error) {
      throw ErrorHandler.fromUnknown(error);
    }
  }

  async put(data: RequestData) {
    try {
      const response = await fetch(this.url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await this.parseResponseBody(response);

      if (!response.ok) {
        throw ErrorHandler.fromResponse(response.status, body);
      }

      return body;
    } catch (error) {
      throw ErrorHandler.fromUnknown(error);
    }
  }

  async delete() {
    try {
      const response = await fetch(this.url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await this.parseResponseBody(response);

      if (!response.ok) {
        throw ErrorHandler.fromResponse(response.status, body);
      }

      return body;
    } catch (error) {
      throw ErrorHandler.fromUnknown(error);
    }
  }
}
