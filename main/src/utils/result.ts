type TResultStatus = "unknown" | "success" | "warning" | "error";
interface IResult<T> { notification?: string, error?: Error, data?: T, status: TResultStatus }


export class Result<T = unknown> implements IResult<T> {

  public status: TResultStatus;

  public notification?: string;
  public data?: T;
  public error?: Error;

  public static create<T>(data?: T, status?: TResultStatus): Result<T> {
    return new this(data, status);
  }

  public static resolve<T>(promise: Promise<T>): Promise<Result<T>> {
    const result = new this<T>();

    return promise
      .then((data) => result.setData(data).setStatus("success"))
      .catch((e) => result.setError(e));
  }

  public constructor(data?: T, status?: TResultStatus) {
    this.data = data;
    this.status = status ?? "unknown";
  }

  public setNotification(message: string): this {
    this.notification = message;
    return this;
  }

  public setData(data: T): this {
    this.data = data;
    return this;
  }

  public setError(error: Error): this {
    this.error = error;
    this.status = "error";
    return this;
  }

  public setStatus(status: TResultStatus): this {
    this.status = status;
    return this;
  }

  public valueOf(): IResult<T> {
    return {
      notification: this.notification,
      error: this.error,
      data: this.data,
      status: this.status
    };
  }
}