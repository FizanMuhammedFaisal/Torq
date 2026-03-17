export interface IMapper<TDomain, TPersistenceInsert, TPersistenceFull> {
	toDomain(entity: TPersistenceFull): TDomain;
	toPersistence(domain: TDomain): TPersistenceInsert;
}
