declare module 'petition' {
    export interface Supporter {
        supportTierId: number;
        title: string;
        description: string;
        cost: number;
    }

    export interface PetitionFromGetOne {
        description: string;
        moneyRaised: number;
        supportTiers: Supporter[];
        petitionId: number;
        title: string;
        categoryId: number;
        ownerId: number;
        ownerFirstName: string;
        ownerLastName: string;
        numberOfSupporters: number;
        creationDate: string;
    }

    export interface PetitionFromGetAll {
        petitionId: string;
        title: string;
        categoryId: number;
        creationDate: string;
        ownerId: number;
        ownerFirstName: string;
        ownerLastName: string;
        numberOfSupporters: number;
        supportingCost: number
    }
}
