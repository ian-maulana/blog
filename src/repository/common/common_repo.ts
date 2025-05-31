export interface CommonRepo {
  getPasswordToken(id: string): Promise<string | undefined>;
}
