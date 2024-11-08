"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Briefcase,
  GraduationCapIcon,
  ComputerIcon,
} from "lucide-react";

export function UserProfile({
  handleVerifyGithub,
  handleVerifyEmployment,
  handleVerifyUdemyCourses,
  handleVerifyLeetcode,
  githubStatus,
  employmentStatus,
  udemyCoursesStatus,
  leetcodeStatus,
  githubContributions,
  lastRole,
  lastCompany,
  courseCompletionRate,
  lastCourseCompletedImage,
  lastCourseCompletedTitle,
  leetcodeUsername,
}: {
  handleVerifyGithub: () => void;
  handleVerifyEmployment: () => void;
  handleVerifyUdemyCourses: () => void;
  handleVerifyLeetcode: () => void;
  githubStatus: string;
  employmentStatus: string;
  udemyCoursesStatus: string;
  leetcodeStatus: string;
  githubContributions: string;
  lastRole: string;
  lastCompany: string;
  courseCompletionRate: string;
  lastCourseCompletedImage: string;
  lastCourseCompletedTitle: string;
  leetcodeUsername: string;
}) {
  const [leetcodeProblemsSolved, setLeetcodeProblemsSolved] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchLeetcodeData = async () => {
      try {
        const response = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`
        );
        const data = await response.json();
        console.log(data);
        setLeetcodeProblemsSolved(data.totalSolved);
      } catch (error) {
        console.error("Error fetching LeetCode data:", error);
      }
    };

    fetchLeetcodeData();
  }, [leetcodeUsername]);

  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-white">Verify Your Profile</CardTitle>
        <CardDescription className="text-zinc-400">
          Connect your accounts to enhance your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {githubContributions !== "" ? (
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-100 mb-2">GitHub Contributions</p>
              <p className="text-2xl font-bold text-white">
                {githubContributions}
              </p>
              <p className="text-zinc-400 text-sm">
                Total contributions this year
              </p>
            </div>
          ) : (
            <Button
              onClick={handleVerifyGithub}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <Github className="mr-2 h-4 w-4" />
              {githubStatus === "" ? "Verify GitHub" : githubStatus}
            </Button>
          )}
        </div>
        <div>
          {lastRole !== "" && lastCompany !== "" ? (
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-100 mb-2">Last Employment</p>
              <p className="text-xl font-bold text-white">{lastRole}</p>
              <p className="text-zinc-400">{lastCompany}</p>
            </div>
          ) : (
            <Button
              onClick={handleVerifyEmployment}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              {employmentStatus === "" ? "Verify Employment" : employmentStatus}
            </Button>
          )}
        </div>
        <div>
          {courseCompletionRate !== "" &&
          lastCourseCompletedImage !== "" &&
          lastCourseCompletedTitle ? (
            <div className="bg-zinc-700 p-4 rounded-lg">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={lastCourseCompletedImage}
                  alt={lastCourseCompletedTitle}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-zinc-100 font-medium">
                    {lastCourseCompletedTitle}
                  </p>
                  <p className="text-zinc-400 text-sm">Udemy Course</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Completion</span>
                  <span className="text-zinc-200 font-medium">
                    {courseCompletionRate}%
                  </span>
                </div>
                <Progress
                  value={parseInt(courseCompletionRate)}
                  className="h-2"
                />
              </div>
            </div>
          ) : (
            <Button
              onClick={handleVerifyUdemyCourses}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <GraduationCapIcon className="mr-2 h-4 w-4" />
              {udemyCoursesStatus === ""
                ? "Verify Udemy Courses"
                : udemyCoursesStatus}
            </Button>
          )}
        </div>
        <div>
          {leetcodeUsername !== "" ? (
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-100 mb-2">LeetCode Profile</p>
              <p className="text-xl font-bold text-white">{leetcodeUsername}</p>
              {leetcodeProblemsSolved !== null && (
                <p className="text-zinc-400">
                  Problems Solved: {leetcodeProblemsSolved}
                </p>
              )}
            </div>
          ) : (
            <Button
              onClick={handleVerifyLeetcode}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <ComputerIcon className="mr-2 h-4 w-4" />
              {leetcodeStatus === "" ? "Verify LeetCode" : leetcodeStatus}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
