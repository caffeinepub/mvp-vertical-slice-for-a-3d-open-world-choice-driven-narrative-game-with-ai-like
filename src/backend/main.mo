import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    createdAt : Time.Time;
  };

  public type Appearance = {
    gender : Text;
    hairColor : Text;
    eyeColor : Text;
    style : Text;
  };

  public type PersonalityTraits = {
    extroversion : Nat; // 0-100
    agreeableness : Nat;
    openness : Nat;
  };

  public type Protagonist = {
    appearance : Appearance;
    traits : PersonalityTraits;
    background : Text;
  };

  public type PersistentGameState = {
    questFlags : [Text];
    location : Text;
    npcRelationships : [(Text, Nat)]; // NPC name to relationship score
  };

  public type DialogueNode = {
    id : Text;
    text : Text;
    choices : [DialogueChoice];
    requiredTraits : ?PersonalityTraits;
  };

  public type DialogueChoice = {
    text : Text;
    nextNodeId : Text;
    requiredRelationship : ?Nat;
    affectRelationship : ?(Text, Nat); // (NPC name, relationship change)
  };

  public type Quest = {
    id : Text;
    title : Text;
    description : Text;
    objectives : [QuestObjective];
    rewards : [Text];
  };

  public type QuestObjective = {
    description : Text;
    isComplete : Bool;
  };

  public type QuestJournalEntry = {
    questId : Text;
    objectives : [QuestObjective];
    state : { #inProgress; #completed; #failed };
  };

  public type PlayerState = {
    protagonist : Protagonist;
    persistentState : PersistentGameState;
    activeQuests : [QuestJournalEntry];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let playerStates = Map.empty<Principal, PlayerState>();
  let quests = Map.empty<Text, Quest>();
  let dialogueNodes = Map.empty<Text, DialogueNode>();

  module QuestJournalEntry {
    public func compareByQuestId(entry1 : QuestJournalEntry, entry2 : QuestJournalEntry) : Order.Order {
      Text.compare(entry1.questId, entry2.questId);
    };
  };

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Game-specific functions
  public shared ({ caller }) func createProtagonist(
    appearance : Appearance,
    traits : PersonalityTraits,
    background : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create protagonists");
    };
    let newProtagonist = { appearance; traits; background };
    let initialState : PlayerState = {
      protagonist = newProtagonist;
      persistentState = {
        questFlags = [];
        location = "Intro";
        npcRelationships = [];
      };
      activeQuests = [];
    };
    playerStates.add(caller, initialState);
  };

  public query ({ caller }) func getProtagonist() : async ?Protagonist {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access protagonist data");
    };
    switch (playerStates.get(caller)) {
      case (null) { null };
      case (?state) { ?state.protagonist };
    };
  };

  public query ({ caller }) func getPersistentGameState() : async ?PersistentGameState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access game state");
    };
    switch (playerStates.get(caller)) {
      case (null) { null };
      case (?state) { ?state.persistentState };
    };
  };

  public shared ({ caller }) func advanceDialogue(currentNodeId : Text, choiceIndex : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can advance dialogue");
    };
    switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?playerState) {
        switch (dialogueNodes.get(currentNodeId)) {
          case (null) { "Dialogue node not found" };
          case (?currentNode) {
            if (choiceIndex >= currentNode.choices.size()) {
              Runtime.trap("Invalid choice index");
            };
            let choice = currentNode.choices[choiceIndex];
            ignore processDialogueChoice(caller, playerState, currentNode, choice);
            choice.nextNodeId;
          };
        };
      };
    };
  };

  func processDialogueChoice(caller : Principal, playerState : PlayerState, currentNode : DialogueNode, choice : DialogueChoice) : Text {
    switch (choice.affectRelationship) {
      case (null) {
        "No relationship change. Next node: ".concat(choice.nextNodeId);
      };
      case (?relationshipChange) {
        let (npcName, change) = relationshipChange;
        let updatedRelationships = updateRelationship(playerState.persistentState.npcRelationships, npcName, change);
        let updatedState = {
          protagonist = playerState.protagonist;
          persistentState = {
            questFlags = playerState.persistentState.questFlags;
            location = playerState.persistentState.location;
            npcRelationships = updatedRelationships;
          };
          activeQuests = playerState.activeQuests;
        };
        playerStates.add(caller, updatedState);
        "Relationship with " # npcName # " changed by " # change.toText().concat(choice.nextNodeId);
      };
    };
  };

  func updateRelationship(relationships : [(Text, Nat)], npc : Text, change : Nat) : [(Text, Nat)] {
    let filtered = relationships.filter(func((name, _)) { name != npc });
    let existingScore = switch (relationships.find(func(x) { x.0 == npc })) {
      case (null) { 0 };
      case (?entry) { entry.1 };
    };
    let newScore = if (change >= 100) { 100 } else {
      existingScore + change;
    };
    filtered.concat([(npc, newScore)]);
  };

  public query ({ caller }) func getActiveQuests() : async [QuestJournalEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access quests");
    };
    switch (playerStates.get(caller)) {
      case (null) { [] };
      case (?state) { state.activeQuests.sort(QuestJournalEntry.compareByQuestId) };
    };
  };

  public shared ({ caller }) func updateQuestProgress(questId : Text, objectiveIndex : Nat, completed : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update quest progress");
    };
    switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?state) {
        let updatedQuests = updateQuestObjective(state.activeQuests, questId, objectiveIndex, completed);
        let updatedState = {
          protagonist = state.protagonist;
          persistentState = state.persistentState;
          activeQuests = updatedQuests;
        };
        playerStates.add(caller, updatedState);
      };
    };
  };

  func updateQuestObjective(quests : [QuestJournalEntry], questId : Text, objectiveIndex : Nat, completed : Bool) : [QuestJournalEntry] {
    quests.map(
      func(q) {
        if (q.questId == questId and objectiveIndex < q.objectives.size()) {
          let updatedObjectives = Array.tabulate(
            q.objectives.size(),
            func(i) {
              if (i == objectiveIndex) {
                {
                  description = q.objectives[i].description;
                  isComplete = completed;
                };
              } else {
                q.objectives[i];
              };
            },
          );
          {
            questId = q.questId;
            objectives = updatedObjectives;
            state = q.state;
          };
        } else {
          q;
        };
      }
    );
  };

  public shared ({ caller }) func createQuest(quest : Quest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create quests");
    };
    quests.add(quest.id, quest);
  };

  public shared ({ caller }) func addQuestToPlayer(questId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add quests");
    };
    switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?state) {
        switch (quests.get(questId)) {
          case (null) { Runtime.trap("Quest not found") };
          case (?quest) {
            let newJournalEntry : QuestJournalEntry = {
              questId = quest.id;
              objectives = quest.objectives.map(func(obj) { { description = obj.description; isComplete = false } });
              state = #inProgress;
            };
            let updatedQuests = [newJournalEntry].concat(state.activeQuests);
            let updatedState = {
              protagonist = state.protagonist;
              persistentState = state.persistentState;
              activeQuests = updatedQuests;
            };
            playerStates.add(caller, updatedState);
          };
        };
      };
    };
  };

  public shared ({ caller }) func completeQuest(questId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete quests");
    };
    switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?state) {
        let updatedQuests = state.activeQuests.map(func(q) { if (q.questId == questId) { { questId = q.questId; objectives = q.objectives; state = #completed } } else {
          q;
        } });
        let updatedState = {
          protagonist = state.protagonist;
          persistentState = state.persistentState;
          activeQuests = updatedQuests;
        };
        playerStates.add(caller, updatedState);
      };
    };
  };
};
