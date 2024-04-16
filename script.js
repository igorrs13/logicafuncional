document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadedImagesContainer = document.getElementById('uploadedImages');

    let uploadedImages = []; // Armazena elementos de imagem
    let uploadedImageHashes = new Set(); // Armazena hashes de dados de imagem para verificar duplicatas
    let lastSelectedImage = null;

    imageUpload.addEventListener('change', function(event) {
        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Gerar hash a partir dos dados da imagem
                const hash = generateHash(e.target.result);
                if (uploadedImageHashes.has(hash)) {
                    console.log('Imagem duplicada detectada e bloqueada.');
                    return; // Não faz nada se a imagem já foi carregada
                }

                // Adicionar o hash ao conjunto para futuras verificações
                uploadedImageHashes.add(hash);

                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.addEventListener('click', function() {
                    selectImage(imgElement);
                });
                uploadedImagesContainer.appendChild(imgElement);
                uploadedImages.push(imgElement);
            };
            reader.readAsDataURL(file);
        });
    });

    function selectImage(imgElement) {
        if (lastSelectedImage && lastSelectedImage !== imgElement) {
            swapImages(imgElement, lastSelectedImage);
            lastSelectedImage.classList.remove('selected');
            lastSelectedImage = null;
        } else if (!imgElement.classList.contains('selected')) {
            imgElement.classList.add('selected');
            lastSelectedImage = imgElement;
        } else {
            imgElement.classList.remove('selected');
            lastSelectedImage = null;
        }
    }

    function swapImages(img1, img2) {
        const index1 = uploadedImages.indexOf(img1);
        const index2 = uploadedImages.indexOf(img2);
        [uploadedImages[index1], uploadedImages[index2]] = [uploadedImages[index2], uploadedImages[index1]];
        uploadedImagesContainer.insertBefore(img2, img1);
        uploadedImagesContainer.insertBefore(img1, uploadedImages[index2 + 1] || null);
    }

    // Função simples para gerar hash baseado em dados de imagem
    function generateHash(data) {
        return btoa(data).substring(0, 50); // Codifica os dados em base64 e pega os primeiros 50 caracteres
    }
});