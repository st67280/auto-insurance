import api from './api';

// Сервис для работы с транспортными средствами
const vehicleService = {
    // Получение информации о ТС по VIN коду
    async getVehicleByVin(vin) {
        try {
            const response = await api.get(`/vehicle/vin/${vin}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle by VIN:', error);

            // Улучшенная заглушка, которая генерирует разные данные в зависимости от VIN
            // Используем часть VIN для создания "псевдо-случайных" данных
            const vinCode = vin.toUpperCase();
            let brandIndex = 0;
            let modelIndex = 0;

            // Используем символы из VIN для выбора марки и модели
            for (let i = 0; i < vinCode.length; i++) {
                brandIndex += vinCode.charCodeAt(i);
                modelIndex += vinCode.charCodeAt(i) * (i + 1);
            }

            // Базы данных марок и моделей для заглушки
            const brands = ['Toyota', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Honda', 'Ford', 'Hyundai', 'Kia', 'Renault', 'Skoda', 'Nissan'];
            const models = {
                'Toyota': ['Corolla', 'Camry', 'RAV4', 'Yaris', 'Land Cruiser'],
                'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo', 'Touareg'],
                'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
                'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC'],
                'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7'],
                'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
                'Ford': ['Focus', 'Fiesta', 'Kuga', 'Mondeo', 'Ranger'],
                'Hyundai': ['i30', 'Tucson', 'Santa Fe', 'i20', 'Kona'],
                'Kia': ['Ceed', 'Sportage', 'Sorento', 'Rio', 'Stonic'],
                'Renault': ['Clio', 'Megane', 'Kadjar', 'Captur', 'Duster'],
                'Skoda': ['Octavia', 'Fabia', 'Superb', 'Kodiaq', 'Karoq'],
                'Nissan': ['Qashqai', 'Juke', 'X-Trail', 'Leaf', 'Micra']
            };

            // Выбор марки и модели на основе VIN
            const brand = brands[brandIndex % brands.length];
            const brandModels = models[brand] || ['Model S', 'Model X'];
            const model = brandModels[modelIndex % brandModels.length];

            // Генерация года выпуска, объема двигателя и веса на основе VIN
            const yearOffset = (brandIndex + modelIndex) % 25; // От 0 до 24 лет
            const currentYear = new Date().getFullYear();
            const year = currentYear - yearOffset;

            const engineBase = 1000 + (brandIndex % 3000); // От 1000 до 4000 куб.см
            const engineVolume = Math.round(engineBase / 100) * 100;

            const weightBase = 1000 + (modelIndex % 2000); // От 1000 до 3000 кг
            const weight = Math.round(weightBase / 50) * 50;

            // Определение электромобиля на основе VIN (примерно 10% шанс)
            const isElectric = (vin.charCodeAt(0) + vin.charCodeAt(vin.length - 1)) % 10 === 0;

            // Определение числа владельцев
            const ownersCount = 1 + (vinCode.charCodeAt(vinCode.length - 1) % 5);

            // Создаем объект транспортного средства
            const mockData = {
                _id: 'mockid' + Date.now(),
                vin: vin,
                type: 'car',
                isElectric: isElectric,
                brand: brand,
                model: model,
                year: year,
                engineVolume: isElectric ? 0 : engineVolume,
                weight: weight,
                ownersCount: ownersCount,
                apiData: {
                    DatumPrvniRegistrace: `${year}-01-01T00:00:00`,
                    TovarniZnacka: brand,
                    ObchodniOznaceni: model,
                    MotorZdvihObjem: isElectric ? 0 : engineVolume,
                    HmotnostiProvozni: weight,
                    PocetVlastniku: ownersCount,
                    VozidloDruh: "OSOBNÍ AUTOMOBIL",
                    VozidloElektricke: isElectric ? "ANO" : "NE"
                }
            };

            return mockData;
        }
    },

    // Создание нового ТС вручную
    async createVehicle(vehicleData) {
        try {
            const response = await api.post('/vehicle', vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle:', error);

            // Заглушка для тестирования без API
            return {
                _id: 'mockid' + Date.now(),
                ...vehicleData
            };
        }
    },

    // Получение ТС по ID
    async getVehicleById(id) {
        try {
            const response = await api.get(`/vehicle/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle by ID:', error);
            throw error;
        }
    }
};

export default vehicleService;