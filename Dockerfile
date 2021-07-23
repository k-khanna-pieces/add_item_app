FROM google/dart

WORKDIR /add_item_app

ADD pubspec.* /add_item_app/
RUN pub get
ADD . /add_item_app
RUN pub get --offline

RUN ["chmod", "+x", "bin/startup.sh"]
ENTRYPOINT "bin/startup.sh"


