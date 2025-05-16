export default function NewsCard({ article }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = "https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1")}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{article.date}</span>
          <a href={article.url} className="text-purple-600 hover:text-purple-800 font-medium">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}