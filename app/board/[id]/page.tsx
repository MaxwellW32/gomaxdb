export async function generateMetadata({ params }: { params: { id: string } }) {

    return {
        title: `hello ${params.id}`,
        description: `you typed in ${params.id}`
    }

}

export default function Board({ params }: { params: { id: string } }) {
    return (
        <div>Hello specifc Board {params.id}</div>
    )
}
