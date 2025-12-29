import gradient from 'gradient-string';

export function showLogo() {
  if (!process.stdout.isTTY || process.env.CI) return;

  const logo = `
 ██████╗ ███╗   ███╗     ██████╗ ██╗     ██╗
██╔════╝ ████╗ ████║    ██╔════╝ ██║     ██║
██║      ██╔████╔██║    ██║      ██║     ██║
██║      ██║╚██╔╝██║    ██║      ██║     ██║
╚██████╗ ██║ ╚═╝ ██║    ╚██████╗ ███████╗██║
 ╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚══════╝╚═╝
`;

  console.log(
    gradient(['#00FFFF', '#00CED1', '#00BFFF', '#00FF7F'])(logo)
  );
}
