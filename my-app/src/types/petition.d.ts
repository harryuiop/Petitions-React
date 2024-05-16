declare module "petition" {
    export interface SupporterTiersGet {
        supportTierId: number;
        title: string;
        description: string;
        cost: number;
    }

    export interface CategoryRequest {
        categoryId: string;
        name: string;
    }

    export interface SupporterTiersCreate {
        title: string;
        description: string;
        cost: number;
    }

    export interface PetitionFromGetOne {
        description: string;
        moneyRaised: number;
        supportTiers: SupporterTiersGet[];
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
        petitionId: number;
        title: string;
        categoryId: number;
        creationDate: string;
        ownerId: number;
        ownerFirstName: string;
        ownerLastName: string;
        numberOfSupporters: number;
        supportingCost: number;
    }
}
