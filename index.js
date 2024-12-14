import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const inValidDate = (date) => {
  const startDate =  moment("2020-01-01");
  const endDate = moment("2024-12-10");
  return date.isBetween( startDate, endDate, null, '[]');
};

const markCommit = async (date) => {
  const data = {date: date.toISOString()};
  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);

  await git.commit(date.toISOString(), {
    "--date": date.toISOString()
  });
};

const makeCommits = async (n) => {
    const git = simpleGit();

    for (let i = 0; i < n; i++) {
        const randomWeeks = random.int(1, 54 * 3);
        const randomDays = random.int(0, 6);
        const ramdomDate = moment("2020-01-01").add(randomWeeks, "weeks").add(randomDays, "days");
        if (inValidDate(ramdomDate)) {
            console.log(`Creating commit: ${ramdomDate.toISOString()}`);
            await markCommit(ramdomDate);
        } else {
            console.log(`Skipping commit: ${ramdomDate.toISOString()}`);
        }
    }

    console.log('Pushing commits');
    await git.push();
    
}

await makeCommits(5000);