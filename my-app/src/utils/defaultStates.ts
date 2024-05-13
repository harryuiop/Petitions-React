import {PetitionFromGetOne} from "petition";
import {User} from "user";

export const defaultPetitionFromGetOne: PetitionFromGetOne = {
    description: '',
    moneyRaised: 0,
    supportTiers: [],
    petitionId: 0,
    title: '',
    categoryId: 0,
    ownerId: 0,
    ownerFirstName: '',
    ownerLastName: '',
    numberOfSupporters: 0,
    creationDate: '',
};

export const defaultUser: User = {
    userId: -1,
    firstName: "",
    lastName: "",
    email: ""
};

export const petitionCategory: { [key: number]: string } = {
    1:  "Wildlife",
    2:  "Environmental Causes",
    3:  "Animal Rights",
    4:  "Health and Wellness",
    5:  "Education",
    6:  "Human Rights",
    8:  "Arts and Culture",
    7:  "Technology and Innovation",
    9:  "Community Development",
    10: "Economic Empowerment",
    11: "Science and Research",
    12: "Sports and Recreation"
};

export const sortByCategorys: { [key: number]: { code: string; desc: string } } = {
    1: { code: "ALPHABETICAL_ASC", desc: "alphabetically by title, A-Z" },
    2: { code: "ALPHABETICAL_DESC", desc: "alphabetically by title, Z-A" },
    3: { code: "COST_ASC", desc: "by cost of cheapest support tier ascending" },
    4: { code: "COST_DESC", desc: "by cost of cheapest support tier descending" },
    5: { code: "CREATED_ASC", desc: "chronologically in order of creation date oldest-newest" },
    6: { code: "CREATED_DESC", desc: "chronologically in order of creation date newest-oldest" }
};