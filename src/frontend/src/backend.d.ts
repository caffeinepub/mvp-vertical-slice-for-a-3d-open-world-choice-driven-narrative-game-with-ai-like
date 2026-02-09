import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Appearance {
    eyeColor: string;
    style: string;
    gender: string;
    hairColor: string;
}
export interface QuestJournalEntry {
    state: Variant_completed_inProgress_failed;
    questId: string;
    objectives: Array<QuestObjective>;
}
export type Time = bigint;
export interface PersistentGameState {
    npcRelationships: Array<[string, bigint]>;
    questFlags: Array<string>;
    location: string;
}
export interface Protagonist {
    background: string;
    appearance: Appearance;
    traits: PersonalityTraits;
}
export interface Quest {
    id: string;
    title: string;
    description: string;
    rewards: Array<string>;
    objectives: Array<QuestObjective>;
}
export interface PersonalityTraits {
    agreeableness: bigint;
    extroversion: bigint;
    openness: bigint;
}
export interface QuestObjective {
    description: string;
    isComplete: boolean;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_completed_inProgress_failed {
    completed = "completed",
    inProgress = "inProgress",
    failed = "failed"
}
export interface backendInterface {
    addQuestToPlayer(questId: string): Promise<void>;
    advanceDialogue(currentNodeId: string, choiceIndex: bigint): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeQuest(questId: string): Promise<void>;
    createProtagonist(appearance: Appearance, traits: PersonalityTraits, background: string): Promise<void>;
    createQuest(quest: Quest): Promise<void>;
    getActiveQuests(): Promise<Array<QuestJournalEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPersistentGameState(): Promise<PersistentGameState | null>;
    getProtagonist(): Promise<Protagonist | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateQuestProgress(questId: string, objectiveIndex: bigint, completed: boolean): Promise<void>;
}
