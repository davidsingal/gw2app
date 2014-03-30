role :app, %w{deploy@serra}
role :web, %w{deploy@serra}
role :db,  %w{deploy@serra}

server 'serra', user: 'deploy', roles: %w{web app}, password: fetch(:password)
