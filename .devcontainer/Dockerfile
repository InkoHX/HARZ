FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:14

# Discord.js REPL
RUN yarn global add yuta0801/discord.js-repl

# Starship
RUN curl -fsSL https://starship.rs/install.sh | bash -s -- -y
RUN echo "\neval \"\$(starship init bash)\"" >> /root/.bashrc
