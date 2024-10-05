// ページの読み込みを待つ
window.addEventListener("load", init);

function init() {
    // サイズを指定
    const width = 960;
    const height = 540;
    let rot = 0;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#myCanvas"),
    });

    renderer.setSize(document.body.clientWidth, document.body.clientHeight);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);

    // 球体作成
    const geometry = new THREE.SphereGeometry(300, 30, 30);

    // 画像リスト
    const textureList = [
        "images/earth.jpg",
        "images/img1.jpg",
        "images/img2.jpg",
        "images/img3.jpg",
        "images/img4.jpg"
    ];
    let currentTextureIndex = 0;

    // マテリアルを作成
    let material = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(textureList[currentTextureIndex]),
        side: THREE.DoubleSide,
    });

    // 地球メッシュを作成
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // ポイント光源
    const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
    scene.add(pointLight);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
    scene.add(pointLightHelper);

    // 星屑追加
    createStarField();

    // 星屑作成
    function createStarField() {
        const vertices = [];
        for (let i = 0; i < 500; i++) {
            const x = 3000 * (Math.random() - 0.5);
            const y = 3000 * (Math.random() - 0.5);
            const z = 3000 * (Math.random() - 0.5);

            vertices.push(x, y, z);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        const material = new THREE.PointsMaterial({
            size: 8,
            color: 0xffffff,
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
    }

    // 毎フレーム時に実行されるループイベント
    function tick() {
        rot += 0.5; // 角度を増やす

        // 360度（1回転）を超えた場合
        if (rot >= 360) {
            rot = 0; // 回転角度をリセット
            currentTextureIndex = (currentTextureIndex + 1) % textureList.length; // 次の画像へ
            // 新しいテクスチャをロード
            earth.material.map = new THREE.TextureLoader().load(textureList[currentTextureIndex]);
            earth.material.needsUpdate = true; // マテリアルの更新
        }

        const radian = (rot * Math.PI) / 180; // ラジアン変換

        // カメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 2000 * Math.cos(radian);
        camera.lookAt(new THREE.Vector3(0, 0, -400));

        // ライトを周回させる
        pointLight.position.set(
            500 * Math.sin(Date.now() / 500),
            500 * Math.sin(Date.now() / 1000),
            500 * Math.cos(Date.now() / 500)
        );

        // レンダリング
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }

    tick();

    // ウィンドウ変更時にサイズを維持する処理
    window.addEventListener("resize", onWindowResize);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
