export async function getColors(colorCount) {
    const url = 'http://colormind.io/api/';
    const data = {
        model : 'default',
        input : Array(colorCount).fill('N')
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        return result.result;
    } catch (error) {
        console.error('Error al obtener colores:', error);
        return null;
    }
}
