import 'dart:io';

void createFile(String path, String name, String content) async {
  // ignore: unused_local_variable
  // ignore: unnecessary_new
  var myFile = new File('$path$name').create(recursive: true);
  await File('$path$name').writeAsString(content, mode: FileMode.append);
  
  print('$path$name');
}

void main(List<String> arguments) {
  createFile('./', 'myFile1', '\nsupppp bro');

  File('./myFile1').readAsString().then((String contents) {
    print('File Contents\n---------------');
    print(contents);
  });
}

