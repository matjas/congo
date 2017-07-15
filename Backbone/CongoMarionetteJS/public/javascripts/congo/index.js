Congo = {
  init : function () {
    // router
    Congo.router = new Congo.Router();

    // data
    Congo.databases = new Congo.DatabaseCollection();
    Congo.currentCollection = new Congo.MongoCollections();
    Congo.currentDocuments = new Congo.MongoDocuments();

    // the App layout
    Congo.AppLayout = Marionette.View.extend({
      initialize: function(options) {
        this.options = options;
      },
      regions : {
        navigationRegion : "#nav",
        detailRegion : "#details"
      }
    });

    Congo.appLayout = new Congo.AppLayout({ el : "#app" });
    var breadcrumbs = new Congo.BreadcrumbView();
    Congo.appLayout.getRegion("navigationRegion").show(breadcrumbs);
  },
  start : function () {
    // initialize the app
    Congo.init();

    // for routing purposes
    Backbone.history.start();
  },
  navHome: function () {
    Congo.router.navigate("", true);
  },
  navDatabase: function (db) {
    db = db || Congo.currentDatabase;
    Congo.router.navigate(db, true);
  },
  navCollection: function (collection) {
    collection = collection || Congo.selectedCollection;
    Congo.router.navigate(Congo.currentDatabase + "/" + collection, true);
  },
  navDocument: function (id) {
    Congo.router.navigate(Congo.currentDatabase + "/" + Congo.selectedCollection + "/" + id, true);
  }
}

Congo.Router = Backbone.Router.extend({
  routes : {
    "" : "index",
    ":db" : "showDatabase",
    ":db/:collection" : "showCollection",
    ":db/:collection/new": "newDocument",
    ":db/:collection/:id" : "showEditor"
  },
  setState: function (db, collection, id) {
    if (db) Congo.currentDatabase = db;
    if (collection) Congo.selectedCollection = collection;
    if (id) Congo.selectedDocumentId = id;
  },
  newDocument: function (db, collection) {
    this.setState(db, collection);
    Congo.appLayout.renderEditor();
  },
  showEditor : function (db, collection, id) {
    this.setState(db, collection, id);
    var document = new Congo.MongoDocument({ _id : id })
    document.fetch({
      success : function (model) {
        var editorView = new Congo.EditorView({model: model });
        Congo.appLayout.getRegion("detailRegion").show(editorView);
      }
    });
  },
  showDatabase : function(db) {
    this.setState(db);
    var collectionLoyout = new Congo.CollectionLayoutView({ collection : Congo.currentCollection });
    Congo.appLayout.getRegion("detailRegion").show(collectionLoyout);
    Congo.currentCollection.fetch();
  },
  showCollection : function (db, collection) {
    this.setState(db, collection);
    var documentLayout = new Congo.DocumentLayoutView({ collection : Congo.currentDocuments });
    Congo.appLayout.getRegion("detailRegion").show(documentLayout);
    Congo.currentDocuments.fetch();
  },
  index : function() {
    var dbLayout = new Congo.DatabaseLayoutView({ collection : Congo.databases });
    Congo.appLayout.getRegion("detailRegion").show(dbLayout);
    Congo.databases.fetch();
  }
});