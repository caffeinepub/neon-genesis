import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Comment {
    text: string;
    author: Principal;
    timestamp: bigint;
}
export interface Post {
    id: bigint;
    blueSapphireCount: bigint;
    title: string;
    likeCount: bigint;
    redRubyCount: bigint;
    virtualPrototype?: VirtualPrototype;
    description: string;
    author: Principal;
    timestamp: bigint;
    category: Category;
    diamondCount: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface VirtualPrototype {
    description: string;
    imageUrl: string;
}
export enum Category {
    disasterRelated = "disasterRelated",
    sustainableInfrastructure = "sustainableInfrastructure",
    environmental = "environmental"
}
export enum InvestmentRating {
    diamond = "diamond",
    blueSapphire = "blueSapphire",
    redRuby = "redRuby"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: bigint, text: string): Promise<void>;
    addInvestmentRating(postId: bigint, rating: InvestmentRating): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(title: string, description: string, category: Category, virtualPrototype: VirtualPrototype | null): Promise<bigint>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(postId: bigint): Promise<Array<Comment>>;
    getPost(postId: bigint): Promise<Post | null>;
    getPostsByCategory(category: Category): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unlikePost(postId: bigint): Promise<void>;
}
