<?php

class User {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function register(string $nom, string $prenom, string $email, string $password, ?string $imagePath): bool {
        // Vérifie si email existe
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);

        if ($stmt->fetch()) {
            return false;
        }

        // Hash sécurisé
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // Insert
        $stmt = $this->db->prepare(
            "INSERT INTO users (nom, prenom, email, password, image) 
             VALUES (?, ?, ?, ?, ?)"
        );

        return $stmt->execute([$nom, $prenom, $email, $hash, $imagePath]);
    }

    public function login(string $email, string $password): bool {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) return false;

        if (!password_verify($password, $user['password'])) {
            return false;
        }

        // Démarre la session
        $_SESSION['user'] = [
            'id' => $user['id'],
            'nom' => $user['nom'],
            'prenom' => $user['prenom'],
            'email' => $user['email'],
            'image' => $user['image']
        ];

        return true;
    }

    public function logout(): void {
        session_destroy();
    }

    public function isLogged(): bool {
        return isset($_SESSION['user']);
    }
}
?>
