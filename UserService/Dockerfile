# Usa l'immagine SDK di .NET 8
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia i file di progetto e ripristina le dipendenze
COPY ["UserService/UserService.csproj", "UserService/"]
RUN dotnet restore "UserService/UserService.csproj"

# Copia il resto dei file del progetto
COPY . .

# Costruisci il progetto
WORKDIR "/src/UserService"
RUN dotnet build -c Release -o /app/build

# Pubblica il progetto
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserService.dll"]
