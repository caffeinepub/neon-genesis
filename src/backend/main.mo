import Map "mo:core/Map";
import Time "mo:core/Time";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Comment = {
    author : Principal;
    text : Text;
    timestamp : Int;
  };

  public type Category = {
    #environmental;
    #disasterRelated;
    #sustainableInfrastructure;
  };

  public type InvestmentRating = {
    #diamond;
    #blueSapphire;
    #redRuby;
  };

  public type VirtualPrototype = {
    imageUrl : Text;
    description : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type Post = {
    id : Nat;
    title : Text;
    description : Text;
    category : Category;
    author : Principal;
    timestamp : Int;
    virtualPrototype : ?VirtualPrototype;
    likeCount : Nat;
    diamondCount : Nat;
    blueSapphireCount : Nat;
    redRubyCount : Nat;
  };

  var nextPostId = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Nat, Post>();
  let likes = Map.empty<Nat, Set.Set<Principal>>();
  let comments = Map.empty<Nat, [Comment]>();
  let investmentRatings = Map.empty<Nat, Map.Map<Principal, InvestmentRating>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createPost(
    title : Text,
    description : Text,
    category : Category,
    virtualPrototype : ?VirtualPrototype
  ) : async Nat {
    let postId = nextPostId;
    nextPostId += 1;

    let post : Post = {
      id = postId;
      title;
      description;
      category;
      author = caller;
      timestamp = Time.now();
      virtualPrototype;
      likeCount = 0;
      diamondCount = 0;
      blueSapphireCount = 0;
      redRubyCount = 0;
    };

    posts.add(postId, post);
    postId;
  };

  public query ({ caller }) func getPost(postId : Nat) : async ?Post {
    posts.get(postId);
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray();
  };

  public query ({ caller }) func getPostsByCategory(category : Category) : async [Post] {
    posts.values().toArray().filter(
      func(p) { p.category == category }
    );
  };

  public shared ({ caller }) func likePost(postId : Nat) : async () {
    let currentLikes = switch (likes.get(postId)) {
      case (null) { Set.empty<Principal>() };
      case (?set) { set };
    };

    if (not currentLikes.contains(caller)) {
      currentLikes.add(caller);
      likes.add(postId, currentLikes);

      switch (posts.get(postId)) {
        case (null) {};
        case (?post) {
          let updatedPost = {
            post with
            likeCount = currentLikes.size();
          };
          posts.add(postId, updatedPost);
        };
      };
    };
  };

  public shared ({ caller }) func unlikePost(postId : Nat) : async () {
    let currentLikes = switch (likes.get(postId)) {
      case (null) { Set.empty<Principal>() };
      case (?set) { set };
    };

    if (currentLikes.contains(caller)) {
      currentLikes.remove(caller);
      likes.add(postId, currentLikes);

      switch (posts.get(postId)) {
        case (null) {};
        case (?post) {
          let updatedPost = {
            post with
            likeCount = currentLikes.size();
          };
          posts.add(postId, updatedPost);
        };
      };
    };
  };

  public shared ({ caller }) func addComment(postId : Nat, text : Text) : async () {
    let comment : Comment = {
      author = caller;
      text;
      timestamp = Time.now();
    };

    let currentComments = switch (comments.get(postId)) {
      case (null) { [] };
      case (?c) { c };
    };

    let updatedComments = currentComments.concat([comment]);
    comments.add(postId, updatedComments);
  };

  public query ({ caller }) func getComments(postId : Nat) : async [Comment] {
    switch (comments.get(postId)) {
      case (null) { [] };
      case (?c) { c };
    };
  };

  public shared ({ caller }) func addInvestmentRating(postId : Nat, rating : InvestmentRating) : async () {
    switch (posts.get(postId)) {
      case (null) {};
      case (?post) {
        let currentRatings = switch (investmentRatings.get(postId)) {
          case (null) { Map.empty<Principal, InvestmentRating>() };
          case (?map) { map };
        };

        switch (currentRatings.get(caller)) {
          case (?prevRating) {
            switch (prevRating) {
              case (#diamond) {
                let updatedPost = {
                  post with
                  diamondCount = post.diamondCount - 1;
                };
                posts.add(postId, updatedPost);
              };
              case (#blueSapphire) {
                let updatedPost = {
                  post with
                  blueSapphireCount = post.blueSapphireCount - 1;
                };
                posts.add(postId, updatedPost);
              };
              case (#redRuby) {
                let updatedPost = {
                  post with
                  redRubyCount = post.redRubyCount - 1;
                };
                posts.add(postId, updatedPost);
              };
            };
          };
          case (null) {};
        };

        currentRatings.add(caller, rating);
        investmentRatings.add(postId, currentRatings);

        switch (posts.get(postId)) {
          case (null) {};
          case (?currentPost) {
            switch (rating) {
              case (#diamond) {
                let updatedPost = {
                  currentPost with
                  diamondCount = currentPost.diamondCount + 1;
                };
                posts.add(postId, updatedPost);
              };
              case (#blueSapphire) {
                let updatedPost = {
                  currentPost with
                  blueSapphireCount = currentPost.blueSapphireCount + 1;
                };
                posts.add(postId, updatedPost);
              };
              case (#redRuby) {
                let updatedPost = {
                  currentPost with
                  redRubyCount = currentPost.redRubyCount + 1;
                };
                posts.add(postId, updatedPost);
              };
            };
          };
        };
      };
    };
  };
};
