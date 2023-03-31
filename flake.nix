{
  description = "appcenter-download-api";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs { inherit system; };

        in
        {
          devShell = pkgs.mkShell rec {
            buildInputs = with pkgs; [
              nodejs-18_x
            ];

            nativeBuildInputs = with pkgs; [
              nodePackages.pnpm
            ];
          };
        }
      );
}
