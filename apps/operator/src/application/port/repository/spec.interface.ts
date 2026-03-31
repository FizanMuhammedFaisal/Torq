export interface ISpecRepository {
    getSpec(id: string): Promise<Record<string, unknown> | null>;
}