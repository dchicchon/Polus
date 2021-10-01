class UserDocument {
  // bool update;
  // List<String> tokens;
  UserDocument({this.update, this.tokens, this.hasExtension});

  UserDocument.fromJson(Map<String, dynamic> json)
      : this(
            update: json['update'] as List<dynamic>,
            tokens: json['tokens'] as List<dynamic>,
            hasExtension: json['hasExtension'] as bool);

  final List<dynamic> update;
  final List<dynamic> tokens;
  final bool hasExtension;

  Map<String, dynamic> toJson() {
    return {'update': update, 'tokens': tokens, 'hasExtension': hasExtension};
  }
}
